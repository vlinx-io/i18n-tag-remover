const parser = require('@babel/parser')
const fs = require("fs");
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

function removeTag(code) {
    const ast = parser.parse(code)

    traverse(ast, {
        StringLiteral(path) {
            const i18nContent = getI18nContent(path.node.value)
            if (i18nContent) {
                path.node.value = i18nContent
                return
            }

            const noTransContent = getNoTransContent(path.node.value)
            if (noTransContent) {
                path.node.value = noTransContent
                return
            }

            const fallbackContent = getFallbackContent(path.node.value)
            if (fallbackContent) {
                path.node.value = fallbackContent
                return
            }

        }
    })

    return generator(ast).code
}

function getI18nContent(text) {
    const regex = /i18n\((.*)\)/;
    const match = text.match(regex)
    if (match) {
        return match[1]
    }

    return ""
}

function getNoTransContent(text) {
    const regex = /notrans\((.*)\)/;
    const match = text.match(regex)
    if (match) {
        return match[1]
    }

    return ""
}

function getFallbackContent(text) {
    const regex = /fallback\((.*)\)/;
    const match = text.match(regex)
    if (match) {
        return match[1]
    }

    return ""
}

function removeTagInFile(path) {
    const code = fs.readFileSync(path, 'utf-8')
    const modifiedCode = removeTag(code)
    fs.writeFileSync(path, modifiedCode, 'utf-8')
}


!async function () {
    const args = process.argv.slice(2)
    const path = args[0]
    console.log(`remove i18n tag in ${path}`)
    removeTagInFile(path)
}()