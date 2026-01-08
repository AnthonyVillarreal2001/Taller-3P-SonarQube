Ext.define('ParkingApp.store.Spaces', {
    extend: 'Ext.data.Store',
    model: 'ParkingApp.model.Space',
    storeId: 'spacesStore',
    proxy: {
        type: 'ajax',
        url: 'http://localhost:3000/spaces',
        reader: {
            type: 'json',
            root: 'data'  
        }
    },
    autoLoad: true
});