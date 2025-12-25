/**
 * Category Entity
 * Represents a product category with hierarchical structure
 */
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId: string | null;
  parent?: CategoryParent;
  children?: Category[];
  level: number;
  order: number;
  productCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category Parent (lightweight reference)
 */
export interface CategoryParent {
  id: string;
  slug: string;
  name: string;
}

/**
 * Category Tree Node
 */
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

/**
 * Category Breadcrumb Item
 */
export interface CategoryBreadcrumb {
  id: string;
  slug: string;
  name: string;
}

/**
 * Build category breadcrumbs from ancestors
 */
export function buildBreadcrumbs(category: Category): CategoryBreadcrumb[] {
  const breadcrumbs: CategoryBreadcrumb[] = [];

  let current: Category | CategoryParent | undefined = category;
  while (current) {
    breadcrumbs.unshift({
      id: current.id,
      slug: current.slug,
      name: current.name,
    });
    current = 'parent' in current ? current.parent : undefined;
  }

  return breadcrumbs;
}

/**
 * Find category in tree by slug
 */
export function findCategoryBySlug(
  tree: CategoryTreeNode[],
  slug: string
): CategoryTreeNode | null {
  for (const node of tree) {
    if (node.slug === slug) return node;
    if (node.children.length > 0) {
      const found = findCategoryBySlug(node.children, slug);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Flatten category tree to list
 */
export function flattenCategoryTree(tree: CategoryTreeNode[]): Category[] {
  const result: Category[] = [];

  function traverse(nodes: CategoryTreeNode[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return result;
}
