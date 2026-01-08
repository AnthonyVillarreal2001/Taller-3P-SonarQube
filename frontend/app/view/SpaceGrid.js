Ext.define('ParkingApp.view.SpaceGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.spacegrid',
    title: 'Spaces',
    initComponent: function() {
        this.store = Ext.create('ParkingApp.store.Spaces');
        
        this.columns = [
            { text: 'ID', dataIndex: 'id', width: 50 },
            { text: 'Zone ID', dataIndex: 'zone_id', width: 80 },
            { text: 'Number', dataIndex: 'number', width: 80 },
            { text: 'Status', dataIndex: 'status', width: 100 }
        ];
        
        this.tbar = [
            { text: 'Add', handler: function() { Ext.Msg.alert('Info', 'Add Space'); } },
            { text: 'Edit', handler: function() { Ext.Msg.alert('Info', 'Edit Space'); } },
            { text: 'Delete', handler: function() { Ext.Msg.alert('Info', 'Delete Space'); } }
        ];
        
        this.callParent(arguments);
    }
});