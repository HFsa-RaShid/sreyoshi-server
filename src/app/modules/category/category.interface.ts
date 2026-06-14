export type ISubCategory = {
  title: string;
  items: string[];
};

export type ICategory = {
  name: string;
  image: string;
  subCategories: ISubCategory[];
};