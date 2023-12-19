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
    join,
    page = 1,
    perPage = 10,
    search,
    sort,
  } : {
    where: Partial<T>,
    join?: {
      table: string,
      field: string,
      resultField: string,
    },
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
      .map(([key], index) => `"${this.tableName}"."${key}" = $${index + 1}`)
      .join(' AND ');

    const values = Object.values(where);

    if (search) {
      const searchCondition = search.columns
        .map(column => `"${this.tableName}"."${column}" ILIKE $${values.length + 1}`)
        .join(' OR ');

      if (conditions) {
        conditions += ' AND (' + searchCondition + ')';
      } else {
        conditions = searchCondition;
      }

      values.push(`%${search.value}%`);
    }

    const selectClause = join
      ? `"${this.tableName}".*, (SELECT jsonb_agg("${join.table}".*) FROM "${join.table}" WHERE "${this.tableName}"."${join.field}" = "${join.table}"."id" LIMIT 1) -> 0 AS "${join.resultField}"`
      : `"${this.tableName}".*`;


    const joinClause = join
      ? `LEFT JOIN "${join.table}" ON "${this.tableName}"."${join.field}" = "${join.table}"."id"`
      : '';

    const orderByClause = sort
      ? `ORDER BY "${sort.column}" ${sort.direction}`
      : '';

    const groupByClause = join ? `GROUP BY "${this.tableName}".id` : '';

    const offset = (page - 1) * perPage;

    const query = `
    SELECT ${selectClause} FROM "${this.tableName}"
    ${joinClause}
    ${conditions ? 'WHERE ' + conditions : ''}
    ${groupByClause}
    ${orderByClause}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
    `;

    return this.prisma.$queryRawUnsafe(query, ...values, perPage, offset);
  }


  public async findOne({
    where,
    join,
  }: {
    where: Partial<T>,
    join?: {
      table: string,
      field: string,
      resultField: string,
    }
  }): Promise<T | null> {
    const conditions = Object.entries(where)
      .map(([key], index) => `"${this.tableName}"."${key}" = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);

    const selectClause = join
      ? `"${this.tableName}".*, (SELECT jsonb_agg("${join.table}".*) FROM "${join.table}" WHERE "${this.tableName}"."${join.field}" = "${join.table}"."id" LIMIT 1) -> 0 AS "${join.resultField}"`
      : `"${this.tableName}".*`;

    const joinClause = join
      ? `LEFT JOIN "${join.table}" ON "${this.tableName}"."${join.field}" = "${join.table}"."id"`
      : '';

    const groupByClause = join ? `GROUP BY "${this.tableName}".id` : '';

    const query = `SELECT ${selectClause} FROM "${this.tableName}" ${joinClause} WHERE ${conditions} ${groupByClause} LIMIT 1;`;

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