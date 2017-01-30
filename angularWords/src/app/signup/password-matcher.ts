import {AbstractControl} from '@angular/forms'

export const passwordMatcher = (control: AbstractControl): {[key: string]: boolean} => {
      const pass = control.get('password');
        const confirm = control.get('confirmPassword');
        if (!pass || !confirm) return null;
        return pass.value === confirm.value ? null : { nomatch: true };
      };