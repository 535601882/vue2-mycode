import axios from "@/plugins/axios";

export function getAllExportCatalogCategories() {
  return axios.get("/getList");
}
