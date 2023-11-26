import { PrismaClient, Prisma } from '@prisma/client';

class DatabaseService<T extends object> {
  private prisma: PrismaClient;

  private tableName: string;

  constructor(prisma: PrismaClient, tableName: string) {
    this.prisma = prisma;
    this.tableName = tableName;
  }

  public async insertOne(data: T): Promise<number> {
    const fields = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders});`;
    return this.prisma.$queryRaw(Prisma.raw(query), ...values);
  }

  public async findAll(where: Partial<T>): Promise<T[] | null> {
    const conditions = Object.entries(where)
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);

    const query = `SELECT * FROM ${this.tableName} WHERE ${conditions};`;
    return this.prisma.$queryRaw(Prisma.raw(query), ...values);
  }

  public async findOne(where: Partial<T>): Promise<T | null> {
    const conditions = Object.entries(where)
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);

    const query = `SELECT * FROM ${this.tableName} WHERE ${conditions} LIMIT 1;`;
    return this.prisma.$queryRaw(Prisma.raw(query), ...values);
  }

  public async updateOne(where: Partial<T>, data: Partial<T>): Promise<T | null> {
    const updateFields = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const updateValues = Object.values(data);

    const conditionFields = Object.entries(where)
      .map(([key], index) => `${key} = $${updateValues.length + index + 1}`)
      .join(' AND ');
    const conditionValues = Object.values(where);

    const query = `UPDATE ${this.tableName} SET ${updateFields} WHERE ${conditionFields};`;
    return this.prisma.$queryRaw(
      Prisma.raw(query),
      ...updateValues,
      ...conditionValues,
    );
  }
}

export default DatabaseService;