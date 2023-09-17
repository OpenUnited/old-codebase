// Type for tree
export type DataNode = {
  id?: number;
  name: string;
  description?: string;
  children: DataNode[];
  tasks?: any;
  available_tasks?: any;
  parent?: any;
  tags?: Array<any>;
}

export type TreeNode = {
  id?: number;
  title?: string;
  description?: string;
  subtitle?: string;
  children?: TreeNode[];
  parent?: number;
  parentId?: number;
  tasks?: any;
  available_tasks?: any;
  tags?: Array<any>;
}

// export const apiDomain = process.env.NODE_ENV === "development" ? "" : "https://open-united-backend.herokuapp.com";
// export const apiDomain = "";
export const apiDomain = process.env.APPLICATION_MODE === "development" ? "http://localhost:8000" : "";
export const RICH_TEXT_EDITOR_WIDTH = 1000;
export const productionMode = process.env.APPLICATION_MODE === "production";
