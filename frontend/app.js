// Definir la aplicación primero con todas las dependencias
Ext.application({
    name: 'ParkingApp',
    
    // Especificar todas las clases que necesita la aplicación
    requires: [
        'Ext.grid.Panel',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.container.Viewport',
        'Ext.tab.Panel'
    ],
    
    // Definir modelos
    models: ['Zone', 'Space'],
    
    // Definir stores
    stores: ['Zones', 'Spaces'],
    
    // Definir vistas
    views: ['ZoneGrid', 'SpaceGrid'],
    
    launch: function() {
        var zonesStore = Ext.create('ParkingApp.store.Zones');
        var spacesStore = Ext.create('ParkingApp.store.Spaces');
        
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'tabpanel',
                items: [
                    {
                        xtype: 'zonegrid',
                        title: 'Zones',
                        store: zonesStore  
                    },
                    {
                        xtype: 'spacegrid',
                        title: 'Spaces',
                        store: spacesStore  
                    }
                ]
            }]
        });
    }
});