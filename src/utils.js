const comparisonEpsilon = 1e-10;

module.exports = {
    groupBy: (list, keyGetter) => {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    },
    shuffle: (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
    float: {
        LTE: (firstFloat,secondFloat) => {
            return firstFloat - secondFloat <= comparisonEpsilon
        },
    
        GTE: (firstFloat,secondFloat) => {
            return firstFloat - secondFloat >= comparisonEpsilon
        },

        LT: (firstFloat,secondFloat) => {
            return firstFloat - secondFloat < comparisonEpsilon
        },
    
        GT: (firstFloat,secondFloat) => {
            return firstFloat - secondFloat > comparisonEpsilon
        },

        LTEExact: (firstFloat,secondFloat) => {
            return firstFloat - secondFloat <= 0
        },
    
        GTEExact: (firstFloat,secondFloat) => {
            return firstFloat - secondFloat >= 0
        }
    },
    linear: (p1,p2,x) => {
        let a = (p2.y-p1.y)/(p2.x-p1.x);
        let b = p1.y-a*p1.x;
        let y = a*x+b;
        return y;
    }
};