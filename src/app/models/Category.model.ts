export class Category {
  constructor(
    public id: number,
    public name: string,
    public description: string
  ) {}

  // Example method to get full description
  getFullDescription(): string {
    return `${this.name}: ${this.description}`;
  }
}
