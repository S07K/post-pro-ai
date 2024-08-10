import { Button } from '@nextui-org/react';
import React from 'react';

interface PostOptionProps {
    icon: React.ReactNode;
    count: number;
}

const PostOption: React.FC<PostOptionProps> = (props) => {

    return (
        <Button
          isIconOnly
          size='sm'
          className="h-full grid justify-start bg-default-0 mb-1 rounded-none"
          disableRipple
          disabled
        >
          <div className="grid grid-flow-row auto-rows-min justify-items-center">
            {props.icon}
            <small className="mt-0 text-[11px]">{props.count}</small>
          </div>
        </Button>
    );
};

export default PostOption;