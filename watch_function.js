const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();

const addWatch = ({name, brand, price, description, category}) => {
    var watch_id = Math.floor(100000 + Math.random() * 900000);
    var params = {
        Item: {
            watch_id,
            name,
            brand,
            price,
            description,
            category
        },
        TableName: "watches"
    };
    return params;
}


const getOneWatch = (watch_id) => {
    var params = {
        TableName: "watches",
        KeyConditionExpression: 'watch_id = :watch_id',
        ExpressionAttributeValues: {
            ':watch_id': watch_id
        }
    }
    return params;
}

const deleteWatch = async (watch_id) => {
    const params = {
        TableName: "watches",
        Key: {
            watch_id: watch_id
        }
    }
    try {
        await DynamoDB.delete(params).promise()
        return true
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return false
    }
}

const filterFields = async(event) => {
    if(event.field === "getWatch"){
        var { watch_id } = event.arguments;
        var getItem = await DynamoDB.query(getOneWatch(watch_id)).promise();
        return getItem.Items[0];
    }else if(event.field === "addWatch"){
        return await DynamoDB.put(addWatch(event.arguments)).promise();
    }else if(event.field === "deleteWatch"){
        var { watch_id } = event.arguments;
        return await deleteWatch(watch_id);        
    }else{
        var getItems = await DynamoDB.scan({ TableName: "watches" }).promise();
        return getItems.Items; 
    }

}



exports.handler = async(event) => {
    return await filterFields(event);
}