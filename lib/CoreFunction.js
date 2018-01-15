
function createIndexMapping(sClient,index,typeName,mapping,callback){
    //create document type
    sClient.indices.putMapping({
        index:index,
        type : typeName,
        body: mapping
    },function(error,response){
        if (error) {
            callback(error);
        }else{
            callback(null,true);
        }});
}

function rotateIndex(sClient,index1,index2,alias,callback){
    sClient.indices.existsAlias({index:index1,name:alias},function (error,result){
        if (error){
            callback(error);
        }
        if (result) {
            callback(null,{curIndex: index2,oldIndex:index1});
        }else{
            callback(null,{curIndex: index1,oldIndex:index2});
        }
    })
}

function deleteIndex(sClient,index,callback){
    sClient.indices.exists({index:index},function(error, result){
        if (error){
            callback(error);
        }
        if (result){
            sClient.indices.delete({
                index: index
            }, function (error,response) {
                if (error) {
                    callback(error);
                }else{
                    callback(null,true);
                }
            });
        }else{
            callback(null,true);
        }
    })
}

function createIndex(sClient,index, callback){
    //create product index
    sClient.indices.create({
        index: index
    }, function (error,response) {
        if (error) {
            callback(error);
        }else{
            callback(null,true);
        }
    });
}

function aliasIndex(sClient,index1, index2,alias,callback){
    //rotate alias to this new index
    sClient.indices.deleteAlias(
        { index: index2, name: alias
        }, function (error,result){
            if (error) {
                logger.info("alias not exists [index:"+index2+" alias:"+alias+"]");
            }
            //rotate alias to this new index
            sClient.indices.putAlias(
                { index: index1, name: alias
                }, function (error,result){
                    if (error) {
                        callback(error);
                    }
                    else{
                        callback(null,true);
                    }
                })
        })
}

module.exports = {
    createIndexMapping: createIndexMapping,
    aliasIndex: aliasIndex,
    createIndex: createIndex,
    deleteIndex:deleteIndex,
    rotateIndex:rotateIndex,
    createIndexMapping:createIndexMapping
};