import React from 'react';

class Flex extends React.Component {

  render() {
    return (
        <div className="fullbleed flex debug vertical">
            <div className="flex shrink">
                1
            </div>
            <div className="flex">
                2
            </div>
            <div className="flex">
                <div className="flex around bottom">
                    <div className="">
                        <div className="">
                            1
                        </div>
                    </div>
                    <div>
                        4
                    </div>
                </div>
                <div className="flex shrink">
                    2
                </div>
                <div className="flex">
                    3
                </div>

            </div>
        </div>
    );
  }
}
export default Flex;
