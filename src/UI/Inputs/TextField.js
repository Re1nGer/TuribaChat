import React, { forwardRef } from 'react';
import "./TextField.scss";

const TextField = forwardRef(({name, label, onChange, value, ...rest}, ref) => {

    return ( <>
        <div className='form'>
            <label htmlFor={name} className={'form__label'}>{label}
                <input ref={ref} name={name} onChange={onChange} id={name} type={'text'} className={'form__textfield'} {...rest} />
            </label>
        </div>
    </> );
});

export default TextField;