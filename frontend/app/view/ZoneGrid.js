Ext.define('ParkingApp.view.ZoneGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.zonegrid',
    title: 'Zones',
    initComponent: function() {
        this.store = Ext.create('ParkingApp.store.Zones');
        
        this.columns = [
            { text: 'ID', dataIndex: 'id', width: 50 },
            { text: 'Name', dataIndex: 'name', flex: 1 },
            { text: 'Description', dataIndex: 'description', flex: 1 }
        ];
        
        this.tbar = [
            { text: 'Add', handler: function() { Ext.Msg.alert('Info', 'Add Zone'); } },
            { text: 'Edit', handler: function() { Ext.Msg.alert('Info', 'Edit Zone'); } },
            { text: 'Delete', handler: function() { Ext.Msg.alert('Info', 'Delete Zone'); } }
        ];
        
        this.callParent(arguments);
    }
});