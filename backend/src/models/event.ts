import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./index";

interface EventAttributes {
  id: number;
  title: string;
  description: string;
  actor: string;
  date: string;
  status: string;
  verdict?: string;
  reason?: string;
}

type CreateEventAttributes = Optional<EventAttributes, "id">;

interface EventInstance
  extends Model<EventAttributes, CreateEventAttributes>,
    EventAttributes {
  getUsers: ({ paranoid }?: { paranoid: boolean }) => Promise<[EventInstance]>;
}

type EventModelStatic = typeof Model &
  (new () => EventInstance) & {
  };

const Event: EventModelStatic = sequelize.define(
    "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    actor: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    verdict: {
      type: DataTypes.STRING,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    confidence: {
      type: DataTypes.FLOAT,
    },
    analysis: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "events",
    timestamps: true,
  }
) as EventModelStatic;

export default Event;
