export const validateCreatePost = (title: string, text: string) => {
  if (title.length <= 6) {
    return [
      {
        field: "title",
        message: "title must be greater than 6 characters",
      },
    ];
  }

  if (text.length <= 30) {
    return [
      {
        field: "text",
        message: "text must be greater than 30 characters",
      },
    ];
  }

  return null;
};
