export const validateCreatePost = (title: string, text: string) => {
  if (title.length <= 6) {
    return [
      {
        field: "title",
        message: "title must be greater than 6 characters",
      },
    ];
  }

  if (text.length <= 50) {
    return [
      {
        field: "text",
        message: "text must be greater than 50 characters",
      },
    ];
  }

  return null;
};
