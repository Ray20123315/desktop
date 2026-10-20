import * as React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { ISecretScanResult } from './push-protection-error-dialog'
import { VerticalSegmentedControl } from '../lib/vertical-segmented-control'

export enum BypassReason {
  FalsePositive = 'false_positive',
  UsedInTests = 'used_in_tests',
  WillFixLater = 'will_fix_later',
}

export type BypassReasonType =
  | BypassReason.FalsePositive
  | BypassReason.UsedInTests
  | BypassReason.WillFixLater

interface IBypassPushProtectionDialogProps {
  /** The secret to be bypassed */
  readonly secret: ISecretScanResult

  /** The function to call when the user clicks the bypass button */
  readonly bypassPushProtection: (
    secret: ISecretScanResult,
    reason: BypassReasonType
  ) => void

  readonly onDismissed: () => void
}

interface IBypassPushProtectionDialogState {
  readonly reason: BypassReasonType
}
/**
 * The dialog shown when a user wants to bypass the push protection feature of secret scanning.
 */
export class BypassPushProtectionDialog extends React.Component<
  IBypassPushProtectionDialogProps,
  IBypassPushProtectionDialogState
> {
  public constructor(props: IBypassPushProtectionDialogProps) {
    super(props)
    this.state = {
      reason: BypassReason.FalsePositive,
    }
  }

  public render() {
    const items = [
      {
        title: "It's used in tests",
        description:
          '此金鑰僅用於測試，沒有實際風險，公開它不會造成損害或暴露敏感資訊。',
        key: BypassReason.UsedInTests,
      },
      {
        title: "It's a false positive",
        description: '檢測到的字串並非金鑰。',
        key: BypassReason.FalsePositive,
      },
      {
        title: "I'll fix it later",
        description:
          '這確實是金鑰，我瞭解相關風險，並將稍後吊銷它。此選項會觸發安全警報並通知儲存庫管理員。',
        key: BypassReason.WillFixLater,
      },
    ]

    return (
      <Dialog
        title={__DARWIN__ ? '繞過推送檢測' : '繞過推送檢測'}
        onDismissed={this.props.onDismissed}
        onSubmit={this.bypassPushProtection}
        className="bypass-push-protection-dialog"
      >
        <DialogContent>
          <VerticalSegmentedControl
            label={`為何需要繞過此 ${this.props.secret.description} 檢測？`}
            items={items}
            selectedKey={this.state.reason}
            onSelectionChanged={this.onSelectionChanged}
          />
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText="我確認推送此金鑰"
            destructive={true}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onSelectionChanged = (reason: BypassReasonType) => {
    this.setState({ reason })
  }

  private bypassPushProtection = () => {
    this.props.bypassPushProtection(this.props.secret, this.state.reason)
  }
}
