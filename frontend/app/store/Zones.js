Ext.define('ParkingApp.store.Zones', {
    extend: 'Ext.data.Store',
    model: 'ParkingApp.model.Zone',
    storeId: 'zonesStore',
    proxy: {
        type: 'ajax',
        url: 'http://localhost:3000/zones',
        reader: {
            type: 'json',
            root: 'data'  
        }
    },
    autoLoad: true
});