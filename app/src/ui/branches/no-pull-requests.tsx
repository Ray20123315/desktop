import * as React from 'react'
import { encodePathAsUrl } from '../../lib/path'
import { Ref } from '../lib/ref'
import { LinkButton } from '../lib/link-button'

const BlankSlateImage = encodePathAsUrl(
  __dirname,
  'static/empty-no-pull-requests.svg'
)

interface INoPullRequestsProps {
  /** The name of the repository. */
  readonly repositoryName: string

  /** Is the default branch currently checked out? */
  readonly isOnDefaultBranch: boolean

  /** Is this component being rendered due to a search? */
  readonly isSearch: boolean

  /* Called when the user wants to create a new branch. */
  readonly onCreateBranch: () => void

  /** Called when the user wants to create a pull request. */
  readonly onCreatePullRequest: () => void

  /** Are we currently loading pull requests? */
  readonly isLoadingPullRequests: boolean
}

/** The placeholder for when there are no open pull requests. */
export class NoPullRequests extends React.Component<INoPullRequestsProps, {}> {
  public render() {
    return (
      <div className="no-pull-requests">
        <img src={BlankSlateImage} className="blankslate-image" alt="" />
        {this.renderTitle()}
        {this.renderCallToAction()}
      </div>
    )
  }

  private renderTitle() {
    if (this.props.isSearch) {
      return <div className="title">找不到這個 Pull Request。</div>
    } else if (this.props.isLoadingPullRequests) {
      return <div className="title">請稍候</div>
    } else {
      return (
        <div>
          <div className="title">目前沒有開啟中的 Pull Request</div>
          <div className="no-prs">
            儲存庫 <Ref>{this.props.repositoryName}</Ref> 沒有開啟中的 Pull Request
          </div>
        </div>
      )
    }
  }

  private renderCallToAction() {
    if (this.props.isLoadingPullRequests) {
      return (
        <div className="call-to-action">
          正在載入 Pull Request…
        </div>
      )
    }

    if (this.props.isOnDefaultBranch) {
      return (
        <div className="call-to-action">
          要開始下一個專案嗎？你可以{' '}
          <LinkButton onClick={this.props.onCreateBranch}>
            建立新分支
          </LinkButton>。
        </div>
      )
    } else {
      return (
        <div className="call-to-action">
          要從目前分支{' '}
          <LinkButton onClick={this.props.onCreatePullRequest}>
            建立 Pull Request
          </LinkButton>嗎？
        </div>
      )
    }
  }
}
