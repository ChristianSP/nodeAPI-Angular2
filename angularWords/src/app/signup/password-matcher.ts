import {AbstractControl} from '@angular/forms'

export const passwordMatcher = (control: AbstractControl): {[key: string]: boolean} => {
        console.log("-2betis "+ control);
        console.log("-1betis "+control.get('password').value);
        console.log("betis "+control.get('confirmPassword').value);
        
        
      const pass = control.get('password');
        const confirm = control.get('confirmPassword');
        if (!pass || !confirm) return null;
        return pass.value === confirm.value ? null : { nomatch: true };
      };