import { products } from "../utils/data.mockup.js";


export const getProductTemplate = async (messageText = '') => {
    const filteredProducts = messageText === "ทั้งหมด" || !messageText
        ? products
        : products.filter(product =>
            product.name.toLowerCase().includes(messageText.toLowerCase()) ||
            product.description.toLowerCase().includes(messageText.toLowerCase())
        );

    console.log('filteredProducts', filteredProducts)
    console.log('messageText', messageText)
    if (!filteredProducts.length) return null;
    return {
        type: "flex",
        altText: "Product Catalog",
        contents: {
            type: "carousel",
            contents: filteredProducts.map(product => ({
                type: "bubble",
                hero: {
                    type: "image",
                    url: product.imageUrl,
                    size: "full",
                    aspectRatio: "20:13",
                    aspectMode: "cover"
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: product.name,
                            weight: "bold",
                            size: "xl"
                        },
                        {
                            type: "text",
                            text: product.price,
                            weight: "bold",
                            size: "lg",
                            color: "#e91e63"
                        },
                        {
                            type: "text",
                            text: product.description,
                            size: "sm",
                            wrap: true,
                            color: "#999999"
                        }
                    ]
                }
            }))
        }
    };
};
