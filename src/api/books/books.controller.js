const Book = require('models/books');
const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');

exports.list = async (ctx) => {
  let books;

  try {
    books = await Book.find().sort({ _id: -1 }).limit(3).exec();
    // https://mongoosejs.com/docs/queries.html
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = books;
};

exports.get = async (ctx) => {
  const { id } = ctx.params;
  let book;

  try {
    book = await Book.findById(id).exec();
  } catch (e) {
    if (e.name === 'CastError') {
      ctx.status = 400;
      return;
    }
    return ctx.throw(500, e);
  }

  if (!book) {
    ctx.status = 404;
    ctx.body = { message: 'book not found' };
    return;
  }

  ctx.body = book;
};

exports.create = async (ctx) => {
  const { title, authors, publishedDate, price, tags } = ctx.request.body;

  const book = new Book({ title, authors, publishedDate, price, tags });

  try {
    await book.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id);
  } catch (e) {
    if (e.name === 'CastError') {
      ctx.status = 400;
      return;
    }
  }

  ctx.status = 204;
};

exports.replace = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    authors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      })
    ),
    publishedDate: Joi.date().required(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string().required()),
  });

  // 그 다음엔, validate 를 통하여 검증을 합니다.
  const result = schema.validate(ctx.request.body);

  // 스키마가 잘못됐다면
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true, // 이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어줍니다
      new: true, // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다.
      // 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
};

exports.update = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
};
