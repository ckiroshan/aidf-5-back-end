import Hotel from "../infrastructure/entities/Hotel";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

import { Request, Response, NextFunction } from "express";
import { CreateHotelDTO, SearchHotelDTO } from "../domain/dtos/hotel";
import { generateEmbedding } from "./utils/embeddings";
import stripe from "../infrastructure/stripe";

export const getAllHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllHotelsBySearchQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = SearchHotelDTO.safeParse(req.query);
    if (!result.success) {
      throw new ValidationError(`${result.error.message}`);
    }
    const { query } = result.data;

    const queryEmbedding = await generateEmbedding(query);

    const hotels = await Hotel.aggregate([
      {
        $vectorSearch: { index: "hotel_vector_index", path: "embedding", queryVector: queryEmbedding, numCandidates: 25, limit: 4 },
      },
      {
        $project: { _id: 1, name: 1, location: 1, price: 1, image: 1, rating: 1, reviews: 1, score: { $meta: "vectorSearchScore" } },
      },
    ]);

    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotelData = req.body;
    const result = CreateHotelDTO.safeParse(hotelData);

    if (!result.success) {
      throw new ValidationError(`${result.error.message}`);
    }

    const embedding = await generateEmbedding(
      `${result.data.name} ${result.data.description} ${result.data.location} ${result.data.price}`
    );

    // Create Stripe product with default price for the nightly rate
    const product = await stripe.products.create({
      name: result.data.name,
      description: result.data.description,
      default_price_data: {
        unit_amount: Math.round(result.data.price * 100),
        currency: "usd",
      },
    });

    const defaultPriceId = typeof product.default_price === "string" ? product.default_price : (product.default_price as any)?.id;

    await Hotel.create({...result.data, embedding, stripePriceId: defaultPriceId });
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.params._id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.params._id;
    const hotelData = req.body;
    if (!hotelData.name || !hotelData.image || !hotelData.location || !hotelData.price || !hotelData.description) {
      throw new ValidationError("Invalid hotel data");
    }

    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    await Hotel.findByIdAndUpdate(_id, hotelData);
    res.status(200).json(hotelData);
  } catch (error) {
    next(error);
  }
};

export const patchHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.params._id;
    const hotelData = req.body;
    if (!hotelData.price) {
      throw new ValidationError("Price is required");
    }
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    await Hotel.findByIdAndUpdate(_id, { price: hotelData.price });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.params._id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    await Hotel.findByIdAndDelete(_id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const createHotelStripePrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.params._id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    // Create a product with default price for the hotel's nightly rate
    const product = await stripe.products.create({
      name: hotel.name,
      description: hotel.description,
      default_price_data: {
        unit_amount: Math.round(hotel.price * 100),
        currency: "usd",
      },
    });

    const defaultPriceId = typeof product.default_price === "string" ? product.default_price : (product.default_price as any)?.id;

    const updated = await Hotel.findByIdAndUpdate(_id, { stripePriceId: defaultPriceId }, { new: true });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getHotelsFiltered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extracting query parameters
    const { locations, minPrice, maxPrice, sortBy, page = "1", pageSize = "12" } = req.query as Record<string, string>;

    const filters: any = {};

    // Location multi-select
    if (locations) {
      const arr = locations.split("|").map((s) => s.trim());
      filters.location = { $in: arr };
    }

    // Price range (min - max)
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Sorting map
    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      alpha_asc: { name: 1 },
      featured: { rating: -1 }, // fallback logic for featured
    };
    const sort = sortOptions[sortBy] || { name: 1 };

    const pageNum = Math.max(Number(page) || 1, 1);
    const sizeNum = Math.min(Math.max(Number(pageSize) || 12, 1), 48);

    // Querying the DB
    const [items, total] = await Promise.all([
      Hotel.find(filters)
        .sort(sort)
        .skip((pageNum - 1) * sizeNum)
        .limit(sizeNum)
        .select("_id name location image price rating reviews"),
      Hotel.countDocuments(filters),
    ]);

    res.status(200).json({ items, total, page: pageNum, pageSize: sizeNum, totalPages: Math.ceil(total / sizeNum) });
  } catch (error) {
    next(error);
  }
};
