import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  DeleteResult,
  Types,
  UpdateWriteOpResult,
  QueryOptions,
} from "mongoose";

type PopulateOption = { path: string; select?: string } | Array<{ path: string; select?: string }>;

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  async findById(id: Types.ObjectId, populate?: PopulateOption): Promise<T | null> {
    const query = this.model.findById(id);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findByIdAndUpdate(id: Types.ObjectId, update: UpdateQuery<T>, populate?: PopulateOption): Promise<T | null> {
    const query = this.model.findByIdAndUpdate(id, update, { upsert: true, new: true });
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findAll(populate?: PopulateOption): Promise<T[]> {
    const query = this.model.find();
    if (populate) query.populate(populate);
    return query.exec();
  }

  async update(id: Types.ObjectId, data: Partial<T>, populate?: PopulateOption): Promise<T | null> {
    const query = this.model.findByIdAndUpdate(id, data, { new: true });
    if (populate) query.populate(populate);
    return query.exec();
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, update).exec();
  }

  async delete(id: Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult> {
    return this.model.deleteOne(filter).exec();
  }

  async find(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    populate?: PopulateOption
  ): Promise<{ data: T[]; total: number; page: number; pages: number }> {
    const query = this.model.find(filter);
    const total = await this.model.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    query.skip(skip).limit(limit);
    if (populate) query.populate(populate);

    const data = await query.exec();
    return { data, total, page, pages };
  }

  async findOne(filter: FilterQuery<T>, populate?: PopulateOption): Promise<T | null> {
    const query = this.model.findOne(filter);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findByUsernameOrEmail(value: string, populate?: PopulateOption): Promise<T | null> {
    const filter: FilterQuery<T> = {
      $or: [{ email: value }, { username: value }],
    };
    const query = this.model.findOne(filter);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = { upsert: true, new: true },
    populate?: PopulateOption
  ): Promise<T | null> {
    const query = this.model.findOneAndUpdate(filter, update, options);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findOneAndDelete(filter: FilterQuery<T>, populate?: PopulateOption): Promise<T | null> {
    const query = this.model.findOneAndDelete(filter);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async addToSet(id: string, field: string, value: unknown, populate?: PopulateOption): Promise<T | null> {
    const query = this.model.findByIdAndUpdate(
      id,
      { $addToSet: { [field]: value } } as UpdateQuery<T>,
      { new: true }
    );
    if (populate) query.populate(populate);
    return query.exec();
  }

  async pull(id: string, field: string, value: unknown, populate?: PopulateOption): Promise<T | null> {
    const query = this.model.findByIdAndUpdate(
      id,
      { $pull: { [field]: value } } as UpdateQuery<T>,
      { new: true }
    );
    if (populate) query.populate(populate);
    return query.exec();
  }

  async getDocumentCount(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
