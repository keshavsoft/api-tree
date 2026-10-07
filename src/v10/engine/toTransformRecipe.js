const startFunc = ({ inRecipe }) => {
    const localRecipe = inRecipe;

    if (Array.isArray(localRecipe)) {
        const root = {};

        for (const path of localRecipe) {
            const parts = path.split(".");
            let curr = root;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                curr.transform ??= {};
                curr.transform[part] ??= {};

                if (i < parts.length - 1) {
                    curr = curr.transform[part];
                }
            }
        }

        return root;
    }

    if (localRecipe && typeof localRecipe === "object") {
        if ("transform" in localRecipe) {
            return localRecipe;
        }

        const buildTransform = (node) => {
            if (!node || typeof node !== "object" || Array.isArray(node)) {
                return {};
            }

            if ("action" in node) {
                return {};
            }

            const transform = {};
            for (const [key, value] of Object.entries(node)) {
                transform[key] = buildTransform(value);
            }

            return { transform };
        };

        return buildTransform(localRecipe);
    }

    return undefined;
};

export default startFunc;
