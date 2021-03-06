ngapp.service('mergeMasterService', function(progressLogger) {
    let {log, error, progress} = progressLogger;

    const MASTERS_PATH = 'File Header\\Master Files';

    // helper functions
    let clobberMasters = function(merge) {
        progress('Clobbering merge masters...', true);
        let masters = xelib.GetElement(merge.plugin, MASTERS_PATH);
        merge.plugins.forEach(plugin => {
            log(`Removing master ${plugin.filename}`);
            xelib.RemoveArrayItem(masters, '', 'MAST', plugin.filename);
        });
    };

    let cleanMasters = function(merge) {
        progress('Cleaning merge masters...', true);
        let masters = xelib.GetElement(merge.plugin, MASTERS_PATH);
        xelib.CleanMasters(merge.plugin);
        merge.plugins.forEach(plugin => {
            if (xelib.HasArrayItem(masters, '', 'MAST', plugin.filename)) {
                error(`Failed to remove master ${plugin.filename}.`);
                merge.builtWithErrors = true;
            }
        });
    };

    let addMastersToMergedPlugin = function(merge) {
        xelib.AddAllMasters(merge.plugin);
        log(`Added masters to merged plugin`);
    };

    let addMastersToPlugins = function(merge) {
        merge.plugins.forEach(plugin => {
            xelib.AddMaster(plugin.handle, merge.filename);
        });
        log(`Added ${merge.filename} as a master to the plugins being merged`);
    };

    let addMastersMethods = {
        'Clobber': addMastersToMergedPlugin,
        'Clean': addMastersToMergedPlugin,
        'Master': addMastersToPlugins
    };

    let removeMastersMethods = {
        'Clobber': clobberMasters,
        'Clean': cleanMasters,
        'Master': () => {}
    };

    // public api
    this.addMasters = merge => addMastersMethods[merge.method](merge);
    this.removeMasters = merge => removeMastersMethods[merge.method](merge);
});
