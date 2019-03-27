const removeByKey = async (array, params) => {
    await array.some((item, index) => {
        return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
    });
    return array;
};

module.exports = removeByKey;
