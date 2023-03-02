class TodoNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "TodoNotFoundError";
  }
}