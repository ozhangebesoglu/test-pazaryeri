/**
 * Slug Value Object
 * Immutable URL-safe identifier
 */
export class Slug {
  private constructor(public readonly value: string) {
    Object.freeze(this);
  }

  static create(value: string): Slug {
    const normalized = Slug.normalize(value);
    if (!Slug.isValid(normalized)) {
      throw new Error(`Invalid slug: ${value}`);
    }
    return new Slug(normalized);
  }

  static fromText(text: string): Slug {
    const slug = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return Slug.create(slug);
  }

  private static normalize(value: string): string {
    return value.toLowerCase().trim();
  }

  private static isValid(value: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
