declare module '@reis/mongoose-to-json' {
    import { Schema } from 'mongoose';
  
    interface ToJSONOptions {
      transform?: (doc: any, ret: any, options: any) => any;
      // Add other options if needed
    }
  
    function toJSONPlugin(options?: ToJSONOptions): (schema: Schema) => void;
  
    export default toJSONPlugin;
  }
  