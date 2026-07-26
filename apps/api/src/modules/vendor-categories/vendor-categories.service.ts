import { randomUUID } from "node:crypto";
import { VendorCategoriesModel } from "./vendor-categories.model.js";

export interface CreateVendorCategoryInput {
  key: string;
  label_en: string;
  label_kh?: string;
  icon?: string;
}

export interface UpdateVendorCategoryInput {
  label_en?: string;
  label_kh?: string;
  icon?: string;
  active?: boolean;
}

export const VendorCategoriesService = {
  list() {
    return VendorCategoriesModel.findMany();
  },

  create(input: CreateVendorCategoryInput) {
    return VendorCategoriesModel.create({
      category_id: randomUUID(),
      ...input,
      active: true,
    });
  },

  async update(categoryId: string, input: UpdateVendorCategoryInput) {
    await VendorCategoriesModel.update(categoryId, { ...input });
    return VendorCategoriesModel.findById(categoryId);
  },

  delete(categoryId: string) {
    return VendorCategoriesModel.delete(categoryId);
  },
};
