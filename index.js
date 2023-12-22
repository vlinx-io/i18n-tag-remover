const fs = require("fs");

function removeTag(code) {
    code = code.replace(/i18n\((.*?)\)/g, function (match, group1) {
        return group1;
    })
    code = code.replace(/notrans\((.*?)\)/g, function (match, group1) {
        return group1;
    })
    code = code.replace(/fallback\((.*?)\)/g, function (match, group1) {
        return group1;
    })
    return code
}

function removeTagInFile(path) {
    console.log(`remove i18n tag in ${path}`)
    const code = fs.readFileSync(path, 'utf-8')
    const modifiedCode = removeTag(code)
    fs.writeFileSync(path, modifiedCode, 'utf-8')
}

function removeTagInDir(path) {
    const files = fs.readdirSync(path)

    files.forEach(file => {
        const filePath = `${path}/${file}`
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            removeTagInDir(filePath)
        } else if (/\.(js|jsx|md|mdx)$/i.test(file)) {
            removeTagInFile(filePath)
        }
    })
}

function removeTagInPath(path) {
    const stats = fs.statSync(path)
    if (stats.isDirectory()) {
        removeTagInDir(path)
    } else {
        removeTagInFile(path)
    }
}

!async function () {
    if (process.argv.length < 3) {
        console.log('usage: node index.js <path>')
        return
    }

    removeTagInPath(process.argv[2])
}()