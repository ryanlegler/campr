import React, { Component } from 'react';
import classNames from 'classnames';

export default class ArtistImage extends Component {

    render() {

        const imageStyles = {
            backgroundImage: 'url(' + this.props.src + ')'
        }
        const imageClasses = classNames (this.props.classes,{});

        const { count } = this.props;

        return (
            <div className={imageClasses} style={imageStyles}>

                { count &&
                <div className="count flex center middle shrink"> { count }</div>
                }
            </div>
        )
    }
}
