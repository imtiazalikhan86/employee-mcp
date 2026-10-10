export class Knowledge {
  constructor({ title, content, category }) {
    this.title = title;
    this.content = content;
    this.category = category;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
