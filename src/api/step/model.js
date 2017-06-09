import mongoose, { Schema } from 'mongoose'

const stepSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  callId: {
    type: String
  },
  type: {
    type: String,
    enum: ['travel', 'pickup']
  }
}, {
  timestamps: true
})

stepSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      callId: this.callId,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Step', stepSchema)

export const schema = model.schema
export default model
