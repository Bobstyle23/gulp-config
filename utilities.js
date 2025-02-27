const svgStack = {
  mode: {
    stack: {
      example: true,
    },
  },
};

const svgSymbol = {
  mode: {
    symbol: {
      sprite: "../sprite.symbol.svg",
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          plugins: [
            {
              name: "removeAttrs",
              params: {
                attrs: "(fill|stroke)",
              },
            },
          ],
        },
      },
    ],
  },
};

const notificationConfig = (title) => {
  return {
    errorHandler: notify.onError({
      title: `${title}`,
      message: `error <%= error.message %>`,
      sound: false,
    }),
  };
};

export { svgSymbol, svgStack, notificationConfig };
