ngapp.service('assetHelpers', function(bsaHelpers) {
    let service = this;

    this.findBsaFiles = function(plugin, folder) {
        return fh.getFiles(folder, {
            matching: `${fh.getFileBase(plugin)}*.@(bsa|ba2)`,
            recursive: false
        });
    };

    this.getOldPath = function(asset, merge) {
        return bsaHelpers.extractAsset(merge, asset) ||
            merge.dataFolders[asset.plugin] + asset.filePath;
    };

    this.getNewPath = function(asset, merge, expr, skipFn) {
        let newPath = skipFn ? asset.filePath :
            asset.filePath.replace(asset.plugin, merge.filename);
        return `${merge.dataPath}\\${!expr ? newPath :
            newPath.replace(expr, merge.fidReplacer[asset.plugin])}`;
    };

    this.copyAsset = function(asset, merge, expr, skipFn = false) {
        fh.jetpack.copy(
            service.getOldPath(asset, merge),
            service.getNewPath(asset, merge, expr, skipFn)
        );
    };

    this.copyToMerge = function(filePath, merge) {
        let fileName = fh.getFileName(filePath);
        fh.jetpack.copy(filePath, `${merge.dataPath}\\${fileName}`);
    };

    this.findGameAssets = function(plugin, folder, subfolder, expr) {
        let assets = fh.getFiles(folder + subfolder, { matching: expr }),
            fullExpr = `${subfolder}\\${expr}`;
        service.findBsaFiles(plugin, folder).forEach(bsaPath => {
            bsaHelpers.find(bsaPath, fullExpr).forEach(assetPath => {
                assets.push(`${bsaPath}\\${assetPath}`);
            });
        });
        return assets;
    };
});
