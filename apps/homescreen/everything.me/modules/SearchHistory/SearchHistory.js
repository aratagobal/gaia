Evme.SearchHistory = new function Evme_SearchHistory() {
    var _name = "SearchHistory", self = this, history = [];
    var STORAGE_KEY = "userHistory",
        MAXIMUM_ENTRIES = "FROM CONFIG";
    
    this.init = function init(options) {
        !options && (options = {});
        
        MAXIMUM_ENTRIES = options.maxEntries;
        
        populate();
        
        Evme.EventHandler.trigger(_name, "init");
    };
    
    this.save = function save(query, type) {
        !type && (type = "");
        query = query.toLowerCase();
        type = type.toLowerCase();
        
        var obj = {
            "query": query,
            "type": type
        };
        
        var removed = self.remove(obj);
        
        history.push(obj);
        trim();
        
        saveToStorage();
        
        return removed;
    };
    
    this.remove = function remove(obj) {
        var itemPosition = -1;
        
        for (var i=0,l=history.length; i<l; i++) {
            if (history[i].query == obj.query) {
                itemPosition = i;
                break;
            }
        }
        
        if (itemPosition != -1) {
            history.splice(itemPosition, 1);
        }
        
        return (itemPosition != -1);
    }
    
    this.get = function get() {
        // use slice(0) to clone the array (return val and not ref)
        return history.slice(0).reverse();
    };
    
    this.clear = function clear() {
        history = [];
        Evme.Storage.remove(STORAGE_KEY);
        
        Evme.EventHandler.trigger(_name, "clear");
    };
    
    function trim() {
        if (history.length > MAXIMUM_ENTRIES) {
            history.splice(0, history.length-MAXIMUM_ENTRIES);
        }
    }
    
    function saveToStorage() {
        var historyString = "";
        try {
            historyString = JSON.stringify(history);
        } catch(ex) {
            
        }
        
        Evme.Storage.add(STORAGE_KEY, historyString);
    }
    
    function populate() {
        var fromStorage = Evme.Storage.get(STORAGE_KEY);
        if (fromStorage) {
            try {
                history = JSON.parse(fromStorage);
                trim();
            } catch(ex) {
                history = [];
            }
        } else {
            history = [];
        }
    }
}