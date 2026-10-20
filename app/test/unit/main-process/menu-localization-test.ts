import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  localizeMenuLabel,
  localizeMenuTemplate,
} from '../../../src/main-process/menu/localize-menu-zh-tw'

describe('zh-TW Windows menu translations', () => {
  it('translates labels and preserves Windows access keys', () => {
    assert.equal(localizeMenuLabel('&File'), '檔案(&F)')
    assert.equal(localizeMenuLabel('E&xit'), '結束(&X)')
    assert.equal(localizeMenuLabel('Pu&ll'), '提取(&L)')
  })

  it('keeps dynamic editor and branch names unmodified', () => {
    assert.equal(
      localizeMenuLabel('O&pen in Visual Studio Code'),
      '使用 Visual Studio Code 開啟(&P)'
    )
    assert.equal(
      localizeMenuLabel('&Update from main'),
      '從 main 更新(&U)'
    )
  })

  it('does not change unknown labels', () => {
    assert.equal(localizeMenuLabel('Custom Extension Name'), 'Custom Extension Name')
  })

  it('keeps IDs and accelerators unchanged', () => {
    const items: Electron.MenuItemConstructorOptions[] = [
      {
        id: 'repository',
        label: '&Repository',
        submenu: [
          {
            id: 'push',
            label: 'P&ush',
            accelerator: 'CmdOrCtrl+P',
          },
        ],
      },
    ]
    localizeMenuTemplate(items)
    assert.equal(items[0].id, 'repository')
    assert.equal(items[0].label, '儲存庫(&R)')
    assert.ok(Array.isArray(items[0].submenu))
    if (!Array.isArray(items[0].submenu)) {
      throw new Error('Expected a submenu')
    }
    assert.equal(items[0].submenu[0].id, 'push')
    assert.equal(items[0].submenu[0].label, '推送(&U)')
    assert.equal(items[0].submenu[0].accelerator, 'CmdOrCtrl+P')
  })
})
