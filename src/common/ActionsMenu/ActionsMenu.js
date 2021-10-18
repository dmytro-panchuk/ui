import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import classnames from 'classnames'

import ActionsMenuItem from '../../elements/ActionMenuItem/ActionsMenuItem'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'

import './actionsMenu.scss'

const ActionsMenu = ({ dataItem, menu, time }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isIconDisplayed, setIsIconDisplayed] = useState(false)
  const [actionMenu, setActionMenu] = useState(menu)
  const [renderMenu, setRenderMenu] = useState(false)
  const [style, setStyle] = useState({})
  const actionMenuRef = useRef()
  const dropDownMenuRef = useRef()
  const dropDownMenuClassNames = classnames(
    'actions-menu__body',
    isShowMenu && 'show'
  )
  const offset = 35
  let idTimeout = null

  useEffect(() => {
    if (!isEmpty(dataItem)) {
      setActionMenu(typeof menu === 'function' ? menu(dataItem) : menu)
    }
  }, [dataItem, menu])

  useEffect(() => {
    setIsIconDisplayed(actionMenu.some(menuItem => menuItem.icon))
  }, [actionMenu])

  const showActionsList = useCallback(
    event => {
      setIsShowMenu(show => !show)
      let { height, top, bottom } =
        actionMenuRef?.current?.getBoundingClientRect() ?? {}
      const {
        height: actionMenuHeight,
        width: actionMenuWidth
      } = dropDownMenuRef.current?.getBoundingClientRect() ?? {
        height: 0,
        width: 0
      }
      const leftPosition =
        event.x - (event.x + actionMenuWidth - window.innerWidth + offset)
      const left =
        event.x + actionMenuWidth > window.innerWidth
          ? leftPosition > offset
            ? leftPosition
            : offset
          : event.x
      if (top + height + offset + actionMenuHeight >= window.innerHeight) {
        setStyle({
          top: bottom - height - actionMenuHeight,
          left: left
        })
      } else {
        setStyle({
          top: top + height,
          left: left
        })
      }
    },
    [setIsShowMenu]
  )

  const handleMouseLeave = () => {
    if (isShowMenu) {
      idTimeout = setTimeout(() => {
        setIsShowMenu(false)
        setRenderMenu(false)
      }, time)
    }
  }

  const handleMouseOver = () => {
    setRenderMenu(true)

    if (idTimeout) clearTimeout(idTimeout)
  }

  useEffect(() => {
    const node = actionMenuRef.current
    if (node) {
      node.addEventListener('click', showActionsList)

      return () => {
        node.removeEventListener('click', showActionsList)
      }
    }
  }, [showActionsList])

  return (
    <div
      className="actions-menu__container"
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseOver}
      ref={actionMenuRef}
    >
      <button>
        <ActionMenu />
      </button>
      {renderMenu &&
        createPortal(
          <div
            data-testid="actions-drop-down-menu"
            className={dropDownMenuClassNames}
            onClick={() => setIsShowMenu(false)}
            ref={dropDownMenuRef}
            style={{
              ...style
            }}
          >
            {actionMenu.map(
              menuItem =>
                !menuItem.hidden && (
                  <ActionsMenuItem
                    dataItem={dataItem}
                    isIconDisplayed={isIconDisplayed}
                    key={menuItem.label}
                    menuItem={menuItem}
                  />
                )
            )}
          </div>,
          document.getElementById('overlay_container')
        )}
    </div>
  )
}

ActionsMenu.defaultProps = {
  dataItem: {},
  time: 100
}

ActionsMenu.propTypes = {
  dataItem: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  menu: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.func
  ]).isRequired,
  time: PropTypes.number
}

export default ActionsMenu
