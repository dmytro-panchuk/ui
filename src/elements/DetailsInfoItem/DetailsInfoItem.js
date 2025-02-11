/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import Prism from 'prismjs'

import ChipCell from '../../common/ChipCell/ChipCell'
import DetailsInfoItemChip from '../DetailsInfoItemChip/DetailsInfoItemChip'
import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'
import TextArea from '../../common/TextArea/TextArea'

import { copyToClipboard } from '../../utils/copyToClipboard'
import { CHIP_OPTIONS } from '../../types'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark.svg'
import { ReactComponent as Copy } from 'igz-controls/images/ic_copy-to-clipboard.svg'

const DetailsInfoItem = React.forwardRef(
  (
    {
      changesData,
      chipOptions,
      chipsClassName,
      chipsData,
      currentField,
      detailsInfoDispatch,
      editableFieldType,
      func,
      handleFinishEdit,
      info,
      isFieldInEditMode,
      item,
      link,
      onClick,
      params,
      setChangesData,
      state,
      target_path
    },
    ref
  ) => {
    if (item?.editModeEnabled && item?.editModeType === 'chips') {
      return (
        <DetailsInfoItemChip
          changesData={changesData}
          chipOptions={chipOptions}
          chipsClassName={chipsClassName}
          chipsData={chipsData}
          currentField={currentField}
          detailsInfoDispatch={detailsInfoDispatch}
          editableFieldType={editableFieldType}
          handleFinishEdit={handleFinishEdit}
          isFieldInEditMode={isFieldInEditMode}
          item={item}
          setChangesData={setChangesData}
        />
      )
    } else if (item?.editModeEnabled && isFieldInEditMode) {
      if (editableFieldType === 'input') {
        return (
          <div className="details-item__input-wrapper" ref={ref}>
            <TextArea focused maxLength={500} onChange={item.onChange} type="text" value={info} />
            <Tooltip template={<TextTooltipTemplate text="Apply" />}>
              <RoundedIcon onClick={handleFinishEdit} tooltipText="Apply">
                <Checkmark className="details-item__apply-btn" />
              </RoundedIcon>
            </Tooltip>
          </div>
        )
      }
    } else if (chipsData?.chips?.length) {
      return (
        <div className="details-item__data">
          <ChipCell
            chipOptions={chipOptions}
            className={`details-item__${chipsClassName}`}
            delimiter={chipsData.delimiter}
            elements={chipsData.chips}
            onClick={() => onClick(currentField, item?.editModeType, chipsData.chips)}
            visibleChipsMaxLength="all"
          />
        </div>
      )
    } else if (!isEmpty(target_path)) {
      return (
        <Tooltip
          className="details-item__data details-item__path"
          template={<TextTooltipTemplate text="Click to copy" />}
        >
          <span onClick={() => copyToClipboard(target_path)}>{target_path}</span>
        </Tooltip>
      )
    } else if (currentField === 'target_uri') {
      return (
        <Tooltip
          className="details-item__data details-item__uri"
          template={<TextTooltipTemplate text="Click to copy" />}
        >
          <span onClick={() => copyToClipboard(info)}>{info}</span>
        </Tooltip>
      )
    } else if (currentField === 'usage_example') {
      return (
        <div className="details-item__data details-item__usage-example">
          {info.map((item, index) => (
            <div key={index}>
              <p>
                {item.title}
                <button
                  className="details-item__btn-copy"
                  onClick={() => copyToClipboard(item.code)}
                >
                  <Tooltip template={<TextTooltipTemplate text="copy" />}>
                    <Copy />
                  </Tooltip>
                </button>
              </p>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: item.code && Prism.highlight(item.code, Prism.languages.py, 'py')
                  }}
                />
              </pre>
            </div>
          ))}
        </div>
      )
    } else if (currentField === 'sparkUiUrl') {
      return (
        <Tooltip
          className="details-item__data details-item__link"
          template={<TextTooltipTemplate text={info} />}
        >
          <a className="link" href={'https://' + info} target="_blank" rel="noreferrer">
            {info}
          </a>
        </Tooltip>
      )
    } else if (state) {
      return (
        <div className="details-item__data details-item__status">
          {state}
          <i className={`state-${state}-job status-icon`} />
        </div>
      )
    } else if (!isEmpty(func)) {
      const funcStr = func.split('/').pop()

      return (
        <Tooltip
          className="details-item__data details-item__link"
          template={<TextTooltipTemplate text={funcStr} />}
        >
          <Link
            className="link"
            to={`/projects/${params.projectName}/functions/${funcStr}/overview`}
          >
            {funcStr}
          </Link>
        </Tooltip>
      )
    } else if (link && info) {
      return (
        <Link className="link details-item__data details-item__link" to={link}>
          {info}
        </Link>
      )
    } else if ((typeof info !== 'object' || Array.isArray(info)) && item?.editModeEnabled) {
      return (
        <Tooltip template={<TextTooltipTemplate text="Click to edit" />}>
          <div
            className="details-item__data"
            onClick={() => {
              if (editableFieldType.length === 0) {
                onClick(currentField, item?.editModeType, info)
              }
            }}
          >
            {info.length === 0 ? (
              <span className="details-item__data-edit-placeholder">Click to edit</span>
            ) : (
              info
            )}
          </div>
        </Tooltip>
      )
    }

    return <div className="details-item__data">{info}</div>
  }
)

DetailsInfoItem.defaultProps = {
  chipOptions: {},
  chipsClassName: '',
  chipsData: {
    chips: [],
    delimiter: null
  },
  currentField: '',
  detailsInfoDispatch: () => {},
  editableFieldType: null,
  func: '',
  handleFinishEdit: () => {},
  info: null,
  isFieldInEditMode: false,
  item: {},
  link: '',
  onClick: null,
  params: {},
  setChangesData: () => {},
  state: '',
  target_path: ''
}

DetailsInfoItem.propTypes = {
  changesData: PropTypes.object,
  chipOptions: CHIP_OPTIONS,
  chipsClassName: PropTypes.string,
  chipsData: PropTypes.shape({
    chips: PropTypes.arrayOf(PropTypes.string),
    delimiter: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }),
  currentField: PropTypes.string,
  detailsInfoDispatch: PropTypes.func,
  editableFieldType: PropTypes.string,
  func: PropTypes.string,
  handleFinishEdit: PropTypes.func,
  info: PropTypes.any,
  isFieldInEditMode: PropTypes.bool,
  item: PropTypes.shape({}),
  link: PropTypes.string,
  onClick: PropTypes.func,
  params: PropTypes.shape({}),
  setChangesData: PropTypes.func,
  state: PropTypes.string,
  target_path: PropTypes.string
}

export default DetailsInfoItem
