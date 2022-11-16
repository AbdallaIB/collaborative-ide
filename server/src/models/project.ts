import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})

// Export the project class to be used as TypeScript type
export class Project {
  @prop({ required: [true, 'Title is required.'] })
  title: string;

  @prop({
    default: `html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}`,
  })
  css: string;

  @prop({
    default: `<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
</head>

<body>
  Hello world
</body>

</html>
`,
  })
  html: string;

  @prop({ default: '' })
  js: string;

  @prop({ required: [true, 'Owner id is required.'] })
  ownerId: string;
}

// Create the project model from the project class
const projectModel = getModelForClass(Project);
projectModel.createIndexes();
export default projectModel;
