import db from 'db';

import { PrismaClient } from 'database';
import { number } from 'zod';

class DatabaseService<T extends object> {
  private prisma: PrismaClient;

  private tableName: string;

  constructor(tableName: string) {
    this.prisma = db;
    this.tableName = tableName;
  }

  public async insertOne(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data).map(v => `"${v}"`).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO "${this.tableName}" (${fields}) VALUES (${placeholders}) RETURNING *;`;

    const result = (await this.prisma.$queryRawUnsafe(query, ...values)) as T[];

    return result[0];
  }

  public async updateOne(where: Partial<T>, data: Partial<T>): Promise<T | null> {
    const updateFields = Object.keys(data)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');
    const updateValues = Object.values(data);

    const conditionFields = Object.entries(where)
      .map(([key], index) => `"${key}" = $${updateValues.length + index + 1}`)
      .join(' AND ');
    const conditionValues = Object.values(where);

    const query = `UPDATE "${this.tableName}" SET ${updateFields} WHERE ${conditionFields};`;

    const result = (await this.prisma.$queryRawUnsafe(
      query,
      ...updateValues,
      ...conditionValues,
    )) as T[] | null;

    if (!result) return null;

    return result[0];

  }

  public async findAll({
    where,
    page = 1,
    perPage = 10,
    search,
  } : {
    where: Partial<T>,
    page?: number,
    perPage?: number,
    search?: {
      columns: string[],
      value: string,
    },
    sort?: {
      column: string,
      direction: 'ASC' | 'DESC',
    }
  }): Promise<T[] | null> {
    let conditions = Object.entries(where)
      .map(([key], index) => `"${key}" = $${index + 1}`)
      .join(' AND ');

    const values = Object.values(where);

    if (search) {
      const searchCondition = search.columns
        .map(column => `"${column}" ILIKE $${values.length + 1}`)
        .join(' OR ');

      if (conditions) {
        conditions += ' AND (' + searchCondition + ')';
      } else {
        conditions = searchCondition;
      }

      values.push(`%${search.value}%`);
    }

    const offset = (page - 1) * perPage;

    const query = `
    SELECT * FROM "${this.tableName}"
    ${conditions ? 'WHERE ' + conditions : ''}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
    `;

    return this.prisma.$queryRawUnsafe(query, ...values, perPage, offset);
  }

  public async findOne(where: Partial<T>): Promise<T | null> {
    const conditions = Object.entries(where)
      .map(([key], index) => `"${key}" = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);

    const query = `SELECT * FROM "${this.tableName}" WHERE ${conditions} LIMIT 1;`;

    const result = (await this.prisma.$queryRawUnsafe(query, ...values)) as T[] | undefined;

    if (!result) return null;

    return result[0];
  }

  public async count(where: Partial<T>): Promise<number> {
    const conditions = Object.entries(where)
      .map(([key], index) => `"${key}" = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);

    const query = `SELECT COUNT(*) FROM "${this.tableName}" WHERE ${conditions} LIMIT 1;`;
    const result = (await this.prisma.$queryRawUnsafe(query, ...values)) as { count: number }[] | undefined;

    if (!result) return 0;

    return Number(result[0].count);
  }

  public async deleteOne(where: Partial<T>): Promise<number> {
    const conditions = Object.entries(where)
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);

    const query = `DELETE FROM "${this.tableName}" WHERE ${conditions} LIMIT 1;`;
    return this.prisma.$executeRawUnsafe(query, ...values);
  }

  public async deleteMany(where: Partial<T>): Promise<number> {
    const conditions = Object.entries(where)
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);

    const query = `DELETE FROM "${this.tableName}" WHERE ${conditions};`;
    return this.prisma.$executeRawUnsafe(query, ...values);
  }

}

export default DatabaseService;