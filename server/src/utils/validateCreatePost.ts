export const validateCreatePost = (title: string, text: string) => {
  if (title.length <= 6) {
    return [
      {
        field: "title",
        message: "title must be greater than 6 characters",
      },
    ];
  }

  if (title.length > 100) {
    return [
      {
        field: "title",
        message: "title must be less than 200 characters",
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

  if (text.length > 600) {
    return [
      {
        field: "text",
        message: "text must be less than 2000 characters",
      },
    ];
  }

  return null;
};
