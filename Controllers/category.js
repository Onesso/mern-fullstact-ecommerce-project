import Category from "../modules/category.js";
import slugify from "slugify";





export const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ error: "name is required" });
    }

    const excistingCategory = await Category.findOne({ name });
    if (excistingCategory) {
      return res.json({ error: "Category already excists" });
    }

    const category = await new Category({ name, slug: slugify(name) }).save();
    return res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export const remove = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const removed = await Category.findByIdAndDelete(categoryId);

    res.json(removed);
    //
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

export const update = async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.json( category );
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
};
// this will display all the categories
export const list = async (req, res) => {
  try {
    const listAll = await Category.find({});
    res.json(listAll);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

// this is returning a single category
export const read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    res.json({ category });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};
