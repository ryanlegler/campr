import * as React from 'react';
import classNames from 'classnames';
import * as glyphs from './Glyphs.jsx';

export default class Icon extends React.Component<Props, any>  {

    constructor() {
        super();
    }

    render() {

        const { value, classes } = this.props;
        const icon = glyphs.default[value.toLowerCase()];

        let iconContainerClasses = classNames([`icon__container icon--${ value } ${classes}`], {});
        let iconClasses = classNames('icon', {});

        return (
            <div
                className={ iconContainerClasses }
                onClick={this.props.onClick} >
                <svg className={ iconClasses } >
                     <use xlinkHref={ icon } />
                </svg>
            </div>
       );
    }
}
