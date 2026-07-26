import { adminContext } from "../../config/database.js";

export const VendorCategoriesModel = {
  findMany() {
    return adminContext().table("vendor_categories").findMany();
  },

  findById(categoryId: string) {
    return adminContext()
      .table("vendor_categories")
      .findOne({ where: { category_id: categoryId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("vendor_categories").create(data);
  },

  update(categoryId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("vendor_categories")
      .update({ where: { category_id: categoryId }, data });
  },

  delete(categoryId: string) {
    return adminContext()
      .table("vendor_categories")
      .delete({ where: { category_id: categoryId } });
  },
};
